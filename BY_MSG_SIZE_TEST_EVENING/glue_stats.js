var fs  = require("fs");

var stats = {};

for ( var i = 2; i < process.argv.length; ++i )
{
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

			case 'INT_CHANGE' :
				msg_size = lineArr[ 19 ];
				speed = lineArr[ 11 ];
				break;

			default :
				break;
		}

		if ( msg_size > 0 )
		{
			if ( stats[ msg_size ] === undefined )
				stats[ msg_size ] = Number( speed );
			else
				stats[ msg_size ] += Number( speed );
		}
	}
}

var filesCnt = process.argv.length - 2;
for ( var i in stats )
{
	console.log( i + ' ' + ( stats[ i ] / filesCnt ));
}
