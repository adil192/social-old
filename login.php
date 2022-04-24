<?php
include_once "global_tools.php";
?>
<!doctype html>
<html lang="en">
<head>
	<?php createHead(
		"Login - Social Media Demo",
		"Login to your social media account, or create an account.",
		null,
		null,
		"2022-03-23",
		"InteractiveResource",
		false,
        "viewport-fit=cover"
	); ?>

    <link href="/assets/ext/bootstrap.5.1.3.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

	<link rel="manifest" href="manifest.webmanifest">
	<link rel="apple-touch-icon" href="/maskable_icon_x192.png">
    <link rel="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body>

<div class="page" id="pageLogin">
    <div class="page-header">
        <h1>Login</h1>
    </div>
    <div class="portraitArea">
        <form id="loginForm" action="api/Auth.Login.php" method="post">
            <div class="mb-3">
                <label for="loginEmailInput" class="form-label">Email address or Username</label>
                <input class="form-control"
                       type="text" required
                       id="loginEmailInput" name="email">
            </div>
            <div class="mb-3">
                <label for="loginPasswordInput" class="form-label">Password</label>
                <input class="form-control"
                       type="password" required
                       id="loginPasswordInput" name="password">
            </div>
            <p class="form-error"></p>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <br>
        <p>Don't have an account? Swipe right to sign up!</p>
    </div>
</div>
<div class="page" id="pageSignup">
    <div class="page-header">
        <h1>Sign up</h1>
    </div>
    <div class="portraitArea">
        <form id="signupForm" action="api/Auth.SignUp.php" method="post">
            <div class="mb-3">
                <label for="signupEmailInput" class="form-label">Email address</label>
                <input class="form-control"
                       type="email" required maxlength="50"
                       id="signupEmailInput" name="email">
            </div>
            <div class="mb-3">
                <label for="signupPasswordInput" class="form-label">Password</label>
                <input class="form-control"
                       type="password" required minlength="8"
                       id="signupPasswordInput" name="password">
            </div>
            <div class="mb-3">
                <label for="signupPasswordInput2" class="form-label">Password (again)</label>
                <input class="form-control"
                       type="password" required minlength="8"
                       id="signupPasswordInput2" name="password2">
            </div>
            <p class="form-error"></p>
            <button type="submit" class="btn btn-primary">Sign up</button>
        </form>
    </div>
</div>


<script src="/assets/ext/bootstrap.bundle.5.1.3.min.js"></script>
<script src="assets/scripts/login.js" type="module"></script>

</body>
</html>
