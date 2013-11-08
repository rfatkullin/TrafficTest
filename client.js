var WebSocket = require('ws');
var Logger    = require('./shared').Logger;
var InitSendMsg = require('./shared').InitSendMsg;

function OnOpen()
{
    Logger.InfoLog( 'Connected to server.' );
    g_client.m_connected = true;
}

function MessageProcess( a_msg )
{
    if ( g_client.m_prevMsgLen != a_msg.length  )
    {
        Logger.InfoLog( '[STAT] Average speed = ' + g_client.m_averSpeed / g_client.m_msgCnt + ' Kb/sec. Msg size = ' + g_client.m_prevMsgLen );
        Logger.InfoLog( 'New receive message size = ' + a_msg.length );
        g_client.m_prevMsgLen = a_msg.length;
        g_client.m_msgCnt    = 0;
        g_client.m_averSpeed = 0;
    }

    g_client.m_recvMsgSize += g_client.m_prevMsgLen;
}

function OnError()
{
    Logger.InfoLog( 'Error on socket. Exit.' );
    process.exit(0);
}

function OnClose()
{
    Logger.InfoLog( 'Close socket. Exit.' );
    process.exit(0);
}

function SendMsg()
{
    if ( !g_client.m_connected )
        return;

    g_client.send( g_sendMsg, { binary: true } );

    //Logger.InfoLog( 'Send message. Size = ' + SEND_MSG_SIZE );
}

function CalculateSpeed()
{
    var speed = ( 1000 * g_client.m_recvMsgSize ) / SPEED_RECALC_INTERVAL / 1024.0;

    g_client.m_averSpeed += speed;
    ++g_client.m_msgCnt;

    Logger.InfoLog( 'Speed : ' + speed + ' Kb/sec' );

    g_client.m_recvMsgSize = 0;
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
    var addr = 'ws://' + URL + ':' + WEB_SOCKET_SERVER_PORT;
    g_client = new WebSocket( addr );
    g_client.on('open', OnOpen );
    g_client.on('error', OnError );
    g_client.on('close', OnClose );
    g_client.on('message', MessageProcess );
    g_client.m_connected = false;
    g_client.m_prevMsgLen   = 0;
    g_client.m_recvMsgSize  = 0;
    g_client.m_averSpeed    = 0;
    g_client.m_msgCnt       = 1;

    console.log( 'Connecting to server at ' + addr + '. Send messages with size = ' + SEND_MSG_SIZE + ' bytes.' );
}

function Start()
{
    SPEED_RECALC_INTERVAL       = 5000;
    SEND_MSG_SIZE               = 1024;
    MSG_SEND_INTERVAL           = 20; //in milliseconds
    WEB_SOCKET_SERVER_PORT      = 3000;
    URL                         = 'traffic-server.cloudapp.net';

    ProcessCommandLineArgs( process.argv );
    InitSendMsg();
    InitClient();

    setInterval( SendMsg, MSG_SEND_INTERVAL );
    setInterval( CalculateSpeed, SPEED_RECALC_INTERVAL );
}

Start();