function success(msg,errCode) {
    throw new global.errs.Success(msg,errCode)
}

module.exports={
    success
}