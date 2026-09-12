<?php
header("Content-Type: application/json; charset=utf-8");

$rawBody = file_get_contents("php://input");
$body = json_decode($rawBody, true);
$payload = is_array($body) ? $body : $_GET;
$rule = isset($payload["rule"]) ? (string) $payload["rule"] : "default";

$response = [
    "ok" => true,
    "rule" => $rule,
    "message" => "Hello from the PHP backend.",
    "data" => [
        "received" => $payload,
        "timestamp" => date("c"),
    ],
];

echo json_encode($response);
