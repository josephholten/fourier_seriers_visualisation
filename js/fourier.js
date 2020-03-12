function integrate(f, start, end, h){       // using midpoint rule
    let sum = 0;
    for(let i=0; i<(end-start)/h; i++){
        //console.log(f(start+(i+0.5)*h)*h);
        sum += f(start+(i+0.5)*h)*h;
    }
    return sum;
}
function x_shift(f, k){
    function shifted(x){
        return f(x-k);
    }
    return shifted;
}

function fourier_series(f, N, start, end){
    let a = []; // cos
    let b = []; // sin
    let P = end-start;
    var n;
    function integrand_a(x){
        return f(x)*Math.cos(2*Math.PI*x*n/P);
    }
    function integrand_b(x){
        return f(x)*Math.sin(2*Math.PI*x*n/P);
    }
    for(n=0; n<=N; n++){
        a[n] = 2/(end-start)*integrate(integrand_a, start, end, 0.001);
    }
    for(n=0; n<=N; n++){
        b[n] = 2/(end-start)*integrate(integrand_b, start, end, 0.001);
    }
    return {a:a,b:b};
}
function prettify(koefficients, d) {
    var a = koefficients.a;
    var b = koefficients.b;
    for(let i=0; i<a.length; i++){
        if(Math.abs(a[i]) < 10**(-d)){
            a[i]=0;
        }
        if(Math.abs(b[i]) < 10**(-d)){
            b[i]=0;
        }
    }
    return koefficients;
}

function fourier_synthesis(f, v, N, start, end){
    let koef = fourier_series(f, N, start, end);
    function synth(x){
        let sum = koef.a[0]/2;
        let P = end - start;
        for(let n=1; n<koef.a.length; n++){
            sum += koef.a[n]*Math.cos(2*Math.PI*n*x/P) + koef.b[n]*Math.sin(2*Math.PI*n*x/P);
        }
        return sum;
    }
    return synth;
}