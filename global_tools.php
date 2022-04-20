<?php
// $date should be in YYYY-MM-DD or YYYY-MM or YYYY format
function createHead($title=null, $desc=null, $image=null, $og_type=null, $date=null, $dc_type=null, $zoomable=true, $extraViewport="") {
    $meta_viewport = "width=device-width, initial-scale=1, shrink-to-fit=no";
    if (!$zoomable) $meta_viewport .= ", maximum-scale=1.0, user-scalable=no";
    if (!empty($extraViewport)) $meta_viewport .= ", " . $extraViewport;
	?>
	
	<meta charset="utf-8">
	<meta name="viewport" content="<?=$meta_viewport?>">
	
	
	<?php if ($title != null) { ?>
        <?php
		if ($title != "Adil Hanney") $title .= " - Adil Hanney";
        ?>
		<meta property="og:title" content="<?=$title?>"/>
		<meta name="twitter:title" content="<?=$title?>">
        <meta name="DC.Title" content="<?=$title?>">
		<title><?=$title?></title>
	<?php } else { ?>
		<!-- failed to provide a title, using REQUEST_URI instead -->
		<title><?=$_SERVER['REQUEST_URI']?></title>
	<?php } ?>
	
	<?php if ($desc != null) { ?>
		<meta name="description" content="<?=$desc?>" />
		<meta property="og:description" content="<?=$desc?>"/>
		<meta name="twitter:description" content="<?=$desc?>">
        <meta name="DC.Description" content="<?=$desc?>" />
	<?php } ?>

	<?php if ($image != null) { ?>
		<meta property="og:image" content="<?=$image?>"/>
		<meta name="twitter:image" content="<?=$image?>">
	<?php } ?>
	
	<meta property="og:type" content="<?=$og_type ?? "website"?>"/>
	<meta property="og:locale" content="en_GB" />
	<meta name="twitter:card" content="summary">

    <meta name="DC.Creator" content="Adil Hanney" />
    <meta name="DC.Publisher" content="Adil Hanney" />
    <meta name="DC.Language" content="en" />
    <meta name="DC.Format" content="text/html" />
    <meta name="DC.Identifier" content="https://<?=$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']?>"/>
    <meta name="DC.Type" content="<?=$dc_type ?? 'text'?>" />
    <?php if ($date != null) { ?>
        <meta name="DC.Date" content="<?=$date?>" />
    <?php } ?>
	
	<?php
}
