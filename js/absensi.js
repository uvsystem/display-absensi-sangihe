$( document ).ready( function () {
	
	var data = {
		tableSize: 2,
		hariKerja: 22,
		currentPage: 0,
		pilih: 'skpd',
		tanggalAwal: myDate.getNow(),
		tanggalAkhir: myDate.getNow(),
		loaderNumber: 0,
		timeout: 20000
	};
	
	var listLoader = [ { id: 1 }, { id: 2 } ];
	
	$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
	$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );

	//loadSkpd();
	loadRekap();

	// Load data SKPD ke dalam list.
	function loadSkpd() {

		var object = {
			path: '/skpd',
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' )
					listLoader = result.list;

			},
			error: message.error
		};

		rest.callAjaxFree( object );
	};

	// Load data Bgaian ke dalam list.
	function loadBagian() {

		var object = {
			path: '/bagian',
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' )
					listLoader = result.list;

			},
			error: message.error
		};

		rest.callAjaxFree( object );
	};

	function loadRekap() {
		
		var tmp = listLoader[ data.loaderNumber ];

		loadDataRekap( tmp.id);
		
	};
	
	function loadDataRekap( id ) {

		page.load( $( '#content-absen' ), 'html/rekap.html');

		var object = {
			path: '',
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' )
					setDataRekap( result.list, 0 );

			},
			error: message.error
		};

		if ( data.pilih == 'skpd' ) {

			object.path ='/absen/skpd/' + id + '/' + myDate.toFormattedString( data.tanggalAwal ) + '/' + myDate.toFormattedString( data.tanggalAkhir );

		}	 else if ( data.pilih == 'bagian' ) {

			object.path ='/absen/bagian/' + id + '/' + myDate.toFormattedString( data.tanggalAwal ) + '/' + myDate.toFormattedString( data.tanggalAkhir );

		}	else {

			return;

		}

		rest.callAjaxFree( object );

	};

	function setDataRekap( list, pageNumber ) {

		var html = '';

		var base = ( pageNumber * data.tableSize);
		var top = base + data.tableSize;

		if ( top > list.length )
			top = list.length;
		
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];
			
			// Ubah Nama SKPD pada kanan atas
			if ( data.pilih == 'skpd' ) {
			
				$( '#absen-nama' ).val( tmp.pegawai.bagian.skpd.nama );
				
			} else if ( data.pilih == 'bagian' ) {
			
				$( '#absen-nama' ).val( tmp.pegawai.bagian.nama );
				
			} else {
				
				return;
				
			}
					
			html += '<tr>' +
				'<td>' + tmp.pegawai.nip + '</td>' +
				'<td>' + tmp.pegawai.nama + '</td>' +
				'<td>' + tmp.pegawai.jabatan + '</td>' +
				'<td>' + data.hariKerja + '</td>' +
				'<td>' + 'hadir' + '</td>' +
				'<td>' + 'terlambat' + '</td>' +
				'<td>' + 'sakit' + '</td>' +
				'<td>' + 'izin' + '</td>' +
				'<td>' + 'cuti' + '</td>' +
				'<td>' + 'persentase' + '</td>' +
				'</tr>';
		}

		page.change( $( '#table-rekap' ), html );
		
		var sisa = list.length - ( top );
		var reload;

		if ( sisa > 0 ) {
			
			reload = function() {
				setDataRekap( list, ++pageNumber );
			}

			setTimeout( reload, data.timeout);
		} else {
			
			reload = function() {
				
				if ( ( data.loaderNumber + 1 ) < listLoader.length ) {
					
					data.loaderNumber++;
					
				} else {
					
					data.loaderNumber = 0;
				}
				
				loadRekap();
				
			}
			
			setTimeout( reload, data.timeout);
			
		}
	}
	
	function loadRanking() {
		
		page.load( $( '#content-absen' ), 'html/rekap.html');

	};

	// Handler
	$( document ).on( 'click', '#btn-rekap', function() {

		loadRekap();
		
	} );

	$( document ).on( 'click', '#btn-ranking', function() {

		loadRanking();

	} );
	
	$( document ).on( 'change', '#absen-tanggal-awal', function() {
		
		data.tanggalAwal = myDate.fromDatePicker( $( '#absen-tanggal-awal' ).val() );

		loadRekap();
		
	} );

	$( document ).on( 'change', '#absen-tanggal-akhir', function() {
		
		data.tanggalAkhir = myDate.fromDatePicker( $( '#absen-tanggal-akhir' ).val() );

		loadRekap();
		
	} );

	$( document ).on( 'change', '#absen-pilih', function() {

		data.pilih = $( '#absen-pilih' ).val();
		
		if ( !data.pilih)
			return;

		loadRekap();

	} );

	$( document ).on( 'change', '#absen-nama', function() {

		var nama = $( '#absen-nama' ).val();
		
		message.writeLog( 'nama: ' + nama );

		loadRekap();

	} );
});
