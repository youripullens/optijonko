<?php

require_once 'Router.php';

$router->get('/', function () use () {
    include 'views/home.php';
});

$router->serveStatic($_SERVER['REQUEST_URI'], __DIR__);

$router->handleRequest();
