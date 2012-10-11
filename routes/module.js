
/*
 * GET home page.
 */
/*
exports.colour = function(req, res){
  res.render('colour', { title: 'TheFabric' });
};

exports.settings = function(req, res){
  res.render('settings', { name: 'module\'s name...', id: '3' });
};
*/
module.exports = function (params) {
	var app = params.app;
    return {
        colour: function(req, res, next) {
        	res.render('colour', { title: 'TheFabric' });
            // ...
        },

        settings: function(req, res, next) {
        	res.render('settings', { name: "truc machin", id: '3' });
            // ...
        }
    };
};