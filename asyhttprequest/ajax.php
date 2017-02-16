<?php 
$post =$_POST;
$get = $_GET;
if(!empty($post)){
	exit(json_encode($post));
}
if(!empty($get)){
	exit(json_encode($get));
}
