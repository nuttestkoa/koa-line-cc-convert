module.exports = ({ router }) => {
    router.get('/', (ctx, next) => {
        console.log("log ctx")
        console.log(ctx);
        ctx.body = ctx;
    })
};