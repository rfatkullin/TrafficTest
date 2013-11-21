var fs  = require("fs");

var stats = {};

for ( var i = 2; i < process.argv.length; ++i )
{
	var fileNum = i - 2;
	var linesArr = fs.readFileSync( process.argv[ i ] ).toString().split( '\n' );

	for ( var j = 0; j < linesArr.length; ++j )
	{
		var lineArr = linesArr[ j ].split( ' ' );
		var msg_size = -1;
		var speed = -1;

		switch ( lineArr[ 7 ] )
		{
			case '[SPEED_CHANGE]' :
				msg_size = lineArr[ 16 ];
				speed = lineArr[ 11 ];
				break;

			case '[INT_CHANGE]' :
				msg_size = lineArr[ 19 ];
				speed = lineArr[ 11 ];
				break;

			default :
				break;
		}

		if ( msg_size > 0 )
		{
			if ( stats[ msg_size ] === undefined )
			{
				stats[ msg_size ] = [];

				for ( var k = 0; k < fileNum; ++k )
					stats[ msg_size ].push( 0 );

				stats[ msg_size ].push( Number( speed ) );
			}
			else
				stats[ msg_size ].push( Number( speed ) );
		}
	}

	for ( var j in stats )
		if ( stats[ j ].length < fileNum + 1 )
		{
			for ( var k = 0; k < ( fileNum + 1 - stats[ j ].length ); ++k )
				stats[ j ].push( 0 );
		}
}

for ( var i in stats )
{
	var str = i + " ";

	for ( var j = 0; j < stats[ i ].length; ++j )
		str += stats[ i ][ j ] + " ";

	console.log( str );
}
