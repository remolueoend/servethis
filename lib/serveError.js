
function serverError(res, code, message){
    res.statusCode = code;
}

module.exports = function(req, res, ex){
    return {
        notFound: function(message){

        },
        serverError: function(message){

        }
    };
};