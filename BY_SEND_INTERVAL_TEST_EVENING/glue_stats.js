var fs  = require("fs");

var stats = {};

for ( var i = 2; i < process.argv.length; ++i )
{
	var linesArr = fs.readFileSync( process.argv[ i ] ).toString().split( '\n' );

	for ( var j = 0; j < linesArr.length; ++j )
	{
		var lineArr = linesArr[ j ].split( ' ' );
		var interval = -1;
		var speed = -1;

		switch ( lineArr[ 7 ] )
		{
			case '[INT_CHANGE]' :
				interval = lineArr[ 15 ];
				speed = lineArr[ 11 ];
				interval = interval.substring( 0, interval.length - 1 );
				break;

			default :
				break;
		}

		if ( interval > 0 )
		{
			if ( stats[ interval ] === undefined )
				stats[ interval ] = Number( speed );
			else
				stats[ interval ] += Number( speed );
		}
	}
}

var filesCnt = process.argv.length - 2;
for ( var i in stats )
{
	console.log( i + ' ' + ( stats[ i ] / filesCnt ));
}
