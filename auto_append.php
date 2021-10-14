<?php
$output = ob_get_contents();
ob_end_clean();

#$output = str_replace('http://localhost:4001/', 'https://lab.npeu.ox.ac.uk/styleguide-next/', $output);
$output = str_replace('href="/',        'href="/styleguide-next/', $output);
$output = str_replace('link.href = \'/','link.href = \'/styleguide-next/', $output);
$output = str_replace('<script src="/', '<script src="/styleguide-next/', $output);
$output = str_replace('/assets',     '/styleguide-next/assets', $output);
$output = str_replace('data="/',        'data="/styleguide-next/', $output);
$output = str_replace('name="msapplication-config" content="/', 'name="msapplication-config" content="/styleguide-next/', $output);

echo $output;
?>