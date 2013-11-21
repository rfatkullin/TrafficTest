WebSocketServer = require( 'ws' ).Server;
var Logger    = require('./shared').Logger;
var InitSendMsg = require('./shared').InitSendMsg;

function MessageProcess( a_msg )
{
    try
    {
        cmdMsg = JSON.parse( a_msg );

        if ( cmdMsg.m_cmd === 'change_msg_size' )
            SEND_MSG_SIZE = cmdMsg.m_size;
        else if ( cmdMsg.m_cmd === 'change_send_interval' )
        {
            MSG_SEND_INTERVAL = cmdMsg.m_interval;
            SEND_MSG_SIZE     = cmdMsg.m_size;
            Logger.InfoLog( 'New send interval = ' + MSG_SEND_INTERVAL );
        }
        else
        {
            Logger.InfoLog( 'Bad command!' );
            return;
        }

        InitSendMsg();
        Logger.InfoLog( 'New message size = ' + SEND_MSG_SIZE );

        clearInterval( intId );

        //Tell clients that params are changed
        for ( var id in clients )
            clients[ id ].send( a_msg );

        setTimeout( function() { intId = setInterval( SendMsg, MSG_SEND_INTERVAL ); }, 5000 );
    }
    catch ( excp )
    {
        //Not command msg...
    }
}

function OnConnection( a_ws )
{
	Logger.InfoLog( 'Client connected.' );

    a_ws.on( 'message', MessageProcess );
    a_ws.on( 'error', OnError );
    a_ws.on( 'close', OnClose );

    clients[ clientId ] = a_ws;
    a_ws.idInServer = clientId;
    clientId++;
}

function OnError()
{
    Logger.InfoLog( ': Error on client [' + this.idInServer + '].' );
    delete clients[ this.idInServer ];
}

function OnClose()
{
    Logger.InfoLog(': Client [' + this.idInServer + '] left.' );
    delete clients[ this.idInServer ];
}

function SendMsg()
{
    var sentMsgCnt = 0;

    for ( var id in clients )
    {
        clients[ id ].send( g_sendMsg, { binary: true } );
        ++sentMsgCnt;
    }
}

function ProcessCommandLineArgs( a_args )
{
    if ( a_args.length > 2 )
    {
        for ( var i = 2; i < a_args.length; ++i )
        {
            var currArg = a_args[ i ].split( '=' );

            switch ( currArg[ 0 ] )
            {
                case 'send_msg_size' :
                    SEND_MSG_SIZE = eval(currArg[ 1 ]);
                    break;

                case 'help' :
                    console.log( '\tsend_msg_size=<size_in_bytes>\n\thelp' )
                    break;

                default :
                    console.log( 'Unknown arg!' );
                    break;
            }
        }
    }
}

function InitServer()
{
    clientId = 0;
    clients  = {};

    g_server = new WebSocketServer( { port : WEB_SOCKET_SERVER_PORT } );
    g_server.on( 'connection', OnConnection );

    Logger.InfoLog( 'Server started. Send message size = ' + SEND_MSG_SIZE + ' bytes.' );
}

function Start()
{
	SEND_MSG_SIZE			= 0;
	MSG_SEND_INTERVAL       = 30; //in milliseconds
	WEB_SOCKET_SERVER_PORT 	= 3000;

	ProcessCommandLineArgs( process.argv );
	InitSendMsg();
    InitServer();

    intId = setInterval( SendMsg, MSG_SEND_INTERVAL );
}

Start();