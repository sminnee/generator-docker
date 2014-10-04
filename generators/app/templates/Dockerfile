FROM <%= image %>

ADD . /var/www
RUN chown www-data /var/www/mysite/_config.php /var/www/.htaccess
RUN chown www-data -R /var/www/assets
