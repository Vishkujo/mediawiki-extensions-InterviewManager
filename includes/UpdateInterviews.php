<?php

if ( !defined( 'MEDIAWIKI' ) ) {
    die();
}

class UpdateInterviews extends SpecialPage {
    function __construct() {
        parent::__construct( 'UpdateInterviews', 'updateinterviews' );
    }

    function execute( $par ) {
        $this->checkPermissions();

        if ( !$this->getUser()->isAllowed( 'updateinterviews' ) ) {
            throw new PermissionsError( 'updateinterviews' );
        }
        
        $this->setHeaders();
        $output = '';

        // Check if the Python script should be run
        if ( isset( $_POST['run_script'] ) ) {
            // Get the path to the Python script from the config
            $path = $this->getConfig()->get( 'UpdateInterviewsPath' );

            // Run the Python script
            $command = "/usr/bin/python3 " . escapeshellarg($path) . " 2>&1";
            exec( $command, $output, $return_var );

            if ($return_var === 0) {
                $output = '<p>Interviews have been updated! Check <a href="https://jojowiki.com/JoJo_Wiki:Interviews">the interviews JSON page</a> to confirm.</p>';
            } else {
                $output = '<p>Failed to update interviews. Error output: <pre>' . implode("\n", $output) . '</pre></p>';
            }
        }

        // Add the button to update the interviews
        $output .= 'Click below to update the interviews at <a href="https://jojowiki.com/JoJo_Wiki:Interviews">JoJo Wiki:Interviews</a>.<br />
					<form method="post">
                        <input type="submit" name="run_script" value="Update Interviews">
                    </form>';

        $this->getOutput()->addHTML( $output );
    }
}
