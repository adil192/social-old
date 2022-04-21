<div class="page page-overlay" id="pageProfileEdit">
	<div class="page-header">
		<button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
		<h1>Edit profile</h1>
	</div>
	<div class="portraitArea">
		<form id="pageProfileEdit-form">
			<div class="pageProfileEdit-name">
				<label for="pageProfileEdit-name-input" class="form-label">Name</label>
				<input type="text" class="form-control" name="name" id="pageProfileEdit-name-input" minlength="2" maxlength="30" pattern="[A-Za-z0-9.\-_]{2,30}">
			</div>
			<div class="pageProfileEdit-bio">
				<label for="pageProfileEdit-bio-input" class="form-label">Bio</label>
				<textarea class="form-control" name="bio" id="pageProfileEdit-bio-input"></textarea>
			</div>
			<div class="pageProfileEdit-pronouns">
				<label class="form-label">Pronouns</label><br>

				<div class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-hehim" value="he/him">
					<label class="form-check-label" for="pageProfileEdit-pronouns-hehim">he/him</label>
				</div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-sheher" value="she/her">
					<label class="form-check-label" for="pageProfileEdit-pronouns-sheher">she/her</label>
				</div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-theythem" value="they/them">
					<label class="form-check-label" for="pageProfileEdit-pronouns-theythem">they/them</label>
				</div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-other" value="other">
					<label class="form-check-label" for="pageProfileEdit-pronouns-other">
						<input type="text" class="form-control" name="pronouns-other" id="pageProfileEdit-pronouns-other-input" placeholder="Other" maxlength="20">
					</label>
				</div>
			</div>
			<div class="pageProfile-buttonRow">
				<button class="btn btn-primary" type="submit">Save</button>
			</div>
		</form>
	</div>
</div>
