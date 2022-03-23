<?php
include_once "../global_tools.php";
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
		false
	); ?>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<link href="assets/css/style.css" rel="stylesheet">

	<link rel="manifest" href="manifest.webmanifest">
	<link rel="apple-touch-icon" href="/maskable_icon_x192.png">
</head>
<body>

<div class="page" id="pageLogin">
    <div class="page-header">
        <h1>Login</h1>
    </div>
    <div class="portraitArea">
        <form id="loginForm" action="api/Auth.Login.php" method="post">
            <div class="mb-3">
                <label for="loginEmailInput" class="form-label">Email address</label>
                <input class="form-control"
                       type="email" required
                       id="loginEmailInput" name="email">
            </div>
            <div class="mb-3">
                <label for="loginPasswordInput" class="form-label">Password</label>
                <input class="form-control"
                       type="password" required
                       id="loginPasswordInput" name="password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
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
                       type="email" required
                       id="signupEmailInput" name="email">
            </div>
            <div class="mb-3">
                <label for="signupPasswordInput" class="form-label">Password</label>
                <input class="form-control"
                       type="password" required
                       id="signupPasswordInput" name="password">
            </div>
            <div class="mb-3">
                <label for="signupPasswordInput2" class="form-label">Password (again)</label>
                <input class="form-control"
                       type="password" required
                       id="signupPasswordInput2" name="password2">
            </div>
            <button type="submit" class="btn btn-primary">Sign up</button>
        </form>
    </div>
</div>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
<script src="assets/scripts/login.js" type="module"></script>

</body>
</html>
