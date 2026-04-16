const logger = (req, res, next) => {
    console.log(`${req.method} ${req.path} \n`);
    if(req.method !== 'GET') {
        console.log('Body:');
        console.dir(req.body, { depth: null });
    }
    next();
}

export default logger;