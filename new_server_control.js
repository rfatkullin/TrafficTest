var WebSocket = require('ws');
var Logger    = require('./shared').Logger;

function OnClose()
{
    Logger.InfoLog( 'Close properly.' );
    process.exit(0);
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

                case 'type' :
                    switch ( currArg[ 1 ] )
                    {
                        case 'msg' :
                            BY_MSG_SIZE = true;
                            break;

                        case 'time' :
                            BY_MSG_SIZE = false;
                            break;

                        default :
                            ErrorInfo( 'Bad arg format!' );
                            process.exit( 1 );
                    }
                    break;

               case 'send_msg_size' :
                    MSG_SIZE = eval(currArg[ 1 ]);
                    break;

                case 'help' :
                    console.log( '\turl=URL\n\ttype=msg|time\nsend_msg_size=<size_in_bytes>\n\thelp' )
                    process.exit( 1 );
                    break;

                default :
                    Logger.ErrLog( 'Unknown arg!' );
                    process.exit( 1 );
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

    Logger.InfoLog( 'Connecting to server at ' + 'ws://' + URL + ':' + WEB_SOCKET_SERVER_PORT + '. Send messages with size = ' + MSG_SIZE + ' bytes.' );
}


function ChangeMsgSize()
{
    if ( MSG_SIZE === 0 )
        MSG_SIZE = 1;
    else if ( ( MSG_SIZE >= 512 ) && ( MSG_SIZE <= 2048 ) )
        MSG_SIZE += 100;
    else
        MSG_SIZE *= 2;

    if ( MSG_SIZE > MAX_SEND_MSG_SIZE )
        clearInterval( intId );
}

function ChangeInterval()
{
    if ( INTERVAL > 60 )
        INTERVAL /= 2;
    else
        INTERVAL -= 10;

    if ( INTERVAL <= MIN_SEND_INTERVAL )
        clearInterval( intId );
}

function ChangeParams()
{
    if ( BY_MSG_SIZE )
        g_cmdMsg = JSON.stringify( { m_cmd : 'change_msg_size', m_size : MSG_SIZE } );
    else
        g_cmdMsg = JSON.stringify( { m_cmd : 'change_send_interval', m_interval : INTERVAL, m_size : MSG_SIZE } );

    g_client.send( g_cmdMsg );

    if ( BY_MSG_SIZE )
        Logger.InfoLog( 'Change server send msg size to ' + MSG_SIZE + '.' );
    else
        Logger.InfoLog( 'Change server send interval to ' + INTERVAL + ' msecs.' );

    if ( BY_MSG_SIZE )
        ChangeMsgSize();
    else
        ChangeInterval();
}

function Main()
{
    MSG_SIZE                = 0;
    INTERVAL                = 1000;
    WEB_SOCKET_SERVER_PORT  = 3000;
    URL                     = 'traffic-server.cloudapp.net';
    MAX_SEND_MSG_SIZE       = 1024 * 1024 * 8 // 4Mb
    MIN_SEND_INTERVAL       = 1;
    BY_MSG_SIZE             = true;

    ProcessCommandLineArgs( process.argv );
    InitClient();
}

function OnOpen()
{
    ChangeParams();
    intId = setInterval( ChangeParams, 20000 );
}

Main();

