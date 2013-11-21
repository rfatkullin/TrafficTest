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
    try
    {
        cmdMsg = JSON.parse( a_msg );

        var intv = ( ( new Date() ).getTime() - g_client.m_startTime ) / 1000.0;

        if ( cmdMsg.m_cmd === 'change_msg_size' )
        {
            Logger.InfoLog( '[SPEED_CHANGE] Average speed = ' + g_client.m_recvMsgSize / 1024.0 / intv + ' Kb/sec. Msg size = ' + g_client.m_msgLen );
            g_client.m_msgLen = cmdMsg.m_size;

        }
        else if ( cmdMsg.m_cmd === 'change_send_interval' )
        {
            Logger.InfoLog( '[INT_CHANGE] Average speed = ' + g_client.m_recvMsgSize / 1024.0 / intv + ' Kb/sec. Interval = ' + g_client.m_intv + '. Msg size = ' + cmdMsg.m_size );
            g_client.m_intv = cmdMsg.m_interval;
        }
        else
        {
            Logger.InfoLog( 'Bad command!' );
        }

        g_client.m_recvMsgSize  = 0;
    }
    catch ( excp )
    {
        //Not command msg...

        if ( g_client.m_recvMsgSize === 0 )
            g_client.m_startTime = ( new Date() ).getTime();

        g_client.m_recvMsgSize += a_msg.length;
    }
}

function OnError()
{
    Logger.InfoLog( 'Error on socket. Exit.' );
    process.exit(0);
}

function OnClose()
{
    var intv = ( ( new Date() ).getTime() - g_client.m_startTime ) / 1000.0;
    Logger.InfoLog( '[INT_CHANGE] Average speed = ' + g_client.m_recvMsgSize / 1024.0 / intv + ' Kb/sec. Interval = ' + g_client.m_intv + '. Msg size = ' + cmdMsg.m_size );

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
                    Logger.ErrLog( 'Unknown arg!' );
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
    g_client.m_msgLen   = 0;
    g_client.m_recvMsgSize  = 0;
    g_client.m_startTime  = ( new Date() ).getTime();

    console.log( 'Connecting to server at ' + addr + '. Send messages with size = ' + SEND_MSG_SIZE + ' bytes.' );
}

function Start()
{
    SEND_MSG_SIZE               = 1024;
    MSG_SEND_INTERVAL           = 20; //in milliseconds
    WEB_SOCKET_SERVER_PORT      = 3000;
    URL                         = 'traffic-server.cloudapp.net';

    ProcessCommandLineArgs( process.argv );
    InitSendMsg();
    InitClient();

    setInterval( SendMsg, MSG_SEND_INTERVAL );
}

Start();