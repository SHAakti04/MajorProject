class ExpressError extends Error{
    constructor(codeStatus,message){
        super();
        this.codeStatus=codeStatus;
        this.message=message;
    }
}
module.exports=ExpressError;