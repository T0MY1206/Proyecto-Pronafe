<?php

test('registration is disabled', function () {
    $response = $this->get('/register');

    $response->assertStatus(404);
});