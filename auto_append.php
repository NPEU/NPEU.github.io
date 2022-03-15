<?php
$output = ob_get_contents();
ob_end_clean();
$path_root = 'styleguide-next';

#$output = str_replace('http://localhost:4001/', 'https://lab.npeu.ox.ac.uk/styleguide-next/', $output);
$output = str_replace('href="/',        'href="/' . $path_root . '/', $output);
$output = str_replace('link.href = \'/','link.href = \'/' . $path_root . '/', $output);
$output = str_replace('<script src="/', '<script src="/' . $path_root . '/', $output);
$output = str_replace('script.src = \'/', 'script.src = \'/' . $path_root . '/', $output);
$output = str_replace('/assets',     '/' . $path_root . '/assets', $output);
$output = str_replace('data="/',        'data="/' . $path_root . '/', $output);
$output = str_replace('name="msapplication-config" content="/', 'name="msapplication-config" content="/' . $path_root . '/', $output);

echo $output;
?>