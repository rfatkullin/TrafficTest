function InfoLog( a_msg )
{
	console.log( (new Date()) + '[INF] ' + a_msg );
}

function ErrLog( a_msg )
{
	console.log( (new Date())+ '[ERR] ' + a_msg );
}

function InitSendMsg()
{
	g_sendMsg = new Uint8Array( SEND_MSG_SIZE );

    for (var i = 0; i < SEND_MSG_SIZE; ++i )
		g_sendMsg[ i ] = 255;
}

module.exports = { 	Logger 		: { InfoLog: InfoLog, ErrLog: ErrLog },
					InitSendMsg : InitSendMsg
			     };