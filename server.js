function MessageProcess( a_conn, a_msg )
{
	console.log( "[MSG]: " + a_msg );
}

function Start()
{
	WEB_SOCKET_SERVER_PORT 	= 1024;	
	g_webSocketServerCretor = require( 'ws' ).Server;
	g_server 				= new g_webSocketServerCretor( { port : WEB_SOCKET_SERVER_PORT } );
	
	g_server.on( 'connection', function( a_ws )
	{
		console.log( 'Client connected.' );
		a_ws.on( 'message', MessageProcess );
	} );

	console.log( 'Server started.' );
}

Start();