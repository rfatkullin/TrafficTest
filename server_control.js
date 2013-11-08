var WebSocket = require('ws');
var Logger    = require('./shared').Logger;

function OnOpen()
{
    this.send( g_cmdMsg );

    Logger.InfoLog( 'Sent new size to server.' );
}

function OnClose()
{
    Logger.InfoLog( 'Close properly.' );
    process.exit(0);
}

function GenerateCommand()
{
    tmpList  = [];

    var tmpSize = SEND_MSG_SIZE;
    var ind = 2;

    while ( tmpSize > 0 )
    {
        tmpList.push( tmpSize % 10 );
        tmpSize           = Math.floor( tmpSize / 10 );
    }

    g_cmdMsg = new Uint8Array( 2 + tmpList.length );
    g_cmdMsg[ 0 ] = 133;
    g_cmdMsg[ 1 ] = 2 + tmpList.length;

    for ( var i = 0; i < tmpList.length; ++i )
        g_cmdMsg[ 2 + i ] = tmpList[ i ];
}

function MessageProcess( a_msg )
{
    //Skip)))
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
                case 'url' :
                    URL = currArg[ 1 ];
                    break;

                case 'send_msg_size' :
                    SEND_MSG_SIZE = eval(currArg[ 1 ]);
                    break;

                case 'help' :
                    console.log( '\turl=<URL>\n\tsend_msg_size=<size_in_bytes>\n\thelp' )
                    break;

                default :
                    ErrorInfo( 'Unknown arg!' );
                    break;
            }
        }
    }
}

function InitClient()
{
    g_client = new WebSocket('ws://' + URL + ':' + WEB_SOCKET_SERVER_PORT );
    g_client.on('open', OnOpen );
    g_client.on('message', MessageProcess );
    g_client.on('close', OnClose );

    Logger.InfoLog( 'Connecting to server at ' + 'ws://' + URL + ':' + WEB_SOCKET_SERVER_PORT + '. Send messages with size = ' + SEND_MSG_SIZE + ' bytes.' );
}

function Start()
{
    ProcessCommandLineArgs( process.argv );
    GenerateCommand();
    InitClient();
}

function LoopStart( a_msgSize )
{
    Logger.InfoLog( 'Send size = ' + a_msgSize );

    SEND_MSG_SIZE = a_msgSize;
    GenerateCommand();
    InitClient();

    Logger.InfoLog( 'Done.' );
}

SEND_MSG_SIZE               = 1024;
WEB_SOCKET_SERVER_PORT      = 3000;
URL                         = 'traffic-server.cloudapp.net';
MAX_SEND_MSG_SIZE           = 1024 * 1024 * 8 // 4Mb
startMsgSize                = 1;

ProcessCommandLineArgs( process.argv );

var intId = setInterval( ChangeMsgSize, 20000 );

function ChangeMsgSize()
{
    LoopStart( startMsgSize );

    if ( ( startMsgSize >= 512 ) && ( startMsgSize <= 2048 ) )
        startMsgSize += 100;
    else
        startMsgSize *= 2;

    if ( startMsgSize > MAX_SEND_MSG_SIZE )
        clearInterval( intId );
}


