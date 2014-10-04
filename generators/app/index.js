var yeoman = require('yeoman-generator');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: {
    askFor: function() {
      var done = this.async();

      this.log(yosay('Supercharge your dev environment with docker!'));

      this.log('Before we begin, you should find an appropriate Docker image on https://registry.hub.docker.com/\n');

      this.prompt([
        {
          type    : 'input',
          name    : 'image',
          message : 'Which docker image do you want to use to run your development server?',
          default : 'sminnee/silverstripe-lamp'
        },
        {
          type    : 'input',
          name    : 'webroot',
          message : 'What is the webroot of this image?',
          default : '/var/www'
        },
        {
          type    : 'checkbox',
          name    : 'methods',
          message : 'How do you want to run Docker?',
          choices : [
            'Vagrant',
            'Docker image builder'
          ],
          default : ['Vagrant', 'Docker image builder' ]
        }
      ], function (answers) {
        this.image = answers.image;
        this.methods = answers.methods;

        done();
      }.bind(this));
    }
  },

  writing: {
    projectfiles: function () {
      var methodHandlers = {
        'Vagrant' : function(image) {
          this.template('Vagrantfile');
          this.template('Vagrantfile.proxy');

        }.bind(this),

        'Docker image builder' : function(image) {
          this.template('Dockerfile');
          this.template('docker-go');
        }.bind(this)
      }

      this.methods.forEach(function(method) {
        methodHandlers[method](this.image);
      });
    },
  },

  end: function() {
    this.log(yosay('You\'re ready to start running your project with Docker!'));

    var methodHandlers = {
      'Vagrant' : function(image) {
        this.log("To run your Docker project with Vagrant, call:\nHTTP_HOST=8080 vagrant up\n");

      }.bind(this),

      'Docker image builder' : function(image) {
        this.log("To build your project into a Docker image and run it, call:\n./docker-go 8080\n");

      }.bind(this)
    }

    this.methods.forEach(function(method) {
      methodHandlers[method](this.image);
    });

  }

});