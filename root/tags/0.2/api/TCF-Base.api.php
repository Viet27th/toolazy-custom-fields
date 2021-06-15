<?php
class TCF_Base_Api {
    /**
     * Response an error for client
     * if error occurred on server or you're using this function to response an error for client,
     * the error body look like as below:
     * {
        "code" => "",
        "message" => "",
        "data"? => {status: 500}
     * }
     *
     * @param string $code - Error codes are slugs that are used to identify each error. They are mostly useful when a piece of code can produce several different errors, and you want to handle each of those errors differently.
     * @param string $message - Whatever you want.
     * @param number $statusCode - Whatever you want.
     * 
     * @return WP_REST_Request $request Current request.
     */
    public static function sendError( $code, $message, $statusCode = 500 ) {
        return new WP_REST_Response(
            array(
                "code" => $code,
                "message" => $message,
            ), $statusCode
        );
    }

    public static function sendSuccess( $data ) {
        return new WP_REST_Response(
            array(
                "code" => "success",
                "message" => "Success",
                "data" => $data,
            ), 200
        );
    }

    public static function verifyingNonce(WP_REST_Request $request) {
        return wp_verify_nonce($request->get_header("X-WP-Nonce"), TCF_NONCE);
    }
}