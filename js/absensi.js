$( document ).ready( function () {

	var object = {
		path: '/absen/' + myDate.nowFormattedString() + '/' + myDate.nowFormattedString(),
		data: { },
		method: 'GET',
		success: function( result ) {

			var html = '';
			
			for ( var i = 0; i < result.list.length; i++ ) {
				html = i + 1;
			}
			
			page.change( $( '#content-absen' ), html );
		},
		error: message.error
	};
		
	rest.callAjaxFree( object );

});
