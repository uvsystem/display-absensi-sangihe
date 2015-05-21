$( document ).ready( function () {
	
	var data = {
		idSkpd: null, // Ganti null dengan id, jika spesifik untuk SKPD tertentu
		tableSize: 2,
		hariKerja: 22,
		currentPage: 0,
		pilih: 'skpd',
		tanggalAwal: myDate.getNow(),
		tanggalAkhir: myDate.getNow(),
		loaderNumber: 0, // Load mulai dari 0
		timeout: 5000,
		timeoutVar: '',
		hariKerja: {
			januari: 22,
			februari: 22,
			maret: 22,
			april: 22,
			mei: 22,
			juni: 22,
			juli: 22,
			agustus: 22,
			september: 22,
			oktober: 22,
			november: 22,
			desember: 22,
			
			get: function( tanggal ) {
				
				var date = myDate.fromDatePicker( tanggal );

				switch( date.month ) {
					case '01': return this.januari;
					case '02': return this.februari;
					case '03': return this.maret;
					case '04': return this.april;
					case '05': return this.mei;
					case '06': return this.juni;
					case '07': return this.juli;
					case '08': return this.agustus;
					case '09': return this.september;
					case '10': return this.oktober;
					case '11': return this.november;
					case '12': return this.desember;
				}
			}
		}
	};
	
	var listLoader = [ { id: 1 } ];
	
	$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
	$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );

	//loadSkpd(); // Untuk semua skpd
	loadBagian( listLoader[0].id ); // Untuk semua bagian dalam suatu skpd
	
	loadRekap();

	// Load data SKPD ke dalam list.
	function loadSkpd() {
		
		data.pilih = 'pilih';

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
	function loadBagian( idSkpd ) {
		
		data.pilih = 'bagian';

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
		
		// Load bagian berdasarkan skpd, jika idSkpd ditemukan
		if ( idSkpd )
			object.path = '/bagian/skpd/' + idSkpd;
		
		rest.callAjaxFree( object );
	};

	function loadRekap() {
		
		var tmp = listLoader[ data.loaderNumber ];

		loadDataRekap( tmp.id);
		
	};
	
	function loadDataRekap( id ) {
		
		var awal = myDate.formatDatePicker( $( '#absen-tanggal-awal' ).val() );
		var akhir = myDate.formatDatePicker( $( '#absen-tanggal-akhir' ).val() );

		var object = {
			path: '/bagian/rekap/' + id + '/' + awal + '/' + akhir,
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					setDataRekap( result.list, 0 );
					
				} else {
					
					reloadLoadNumber();
					
				}
			},
			error: message.error
		};

		if ( data.pilih == 'skpd' )
			object.path ='/skpd/rekap/' + id + '/' + awal + '/' + akhir;

		page.load( $( '#content-absen' ), 'html/rekap.html');

		rest.callAjaxFree( object );

	};

	function setDataRekap( list, pageNumber ) {

		var tanggalAwal = $( '#absen-tanggal-awal' ).val();
		
		var html = '';

		var base = ( pageNumber * data.tableSize);
		var top = base + data.tableSize;

		if ( top > list.length )
			top = list.length;
		
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];
			
			$( '#nama-skpd' ).html( tmp.bagian.skpd.nama );			
			$( '#nama-bagian' ).html( tmp.bagian.nama );
			
			// Ubah Nama SKPD pada kanan atas
			if ( data.pilih == 'skpd' )
				$( '#nama-bagian' ).html( 'Semua Bagian' );

			var presentase = Math.round( ( ( tmp.hadir / data.hariKerja.get( tanggalAwal ) ) * 100 ) );
			
			html += '<tr>' +
				'<td>' + tmp.nip + '</td>' +
				'<td>' + tmp.nama + '</td>' +
				'<td>' + tmp.jabatan + '</td>' +
				'<td>' + data.hariKerja.get( tanggalAwal ) + '</td>' +
				'<td>' + tmp.hadir + '</td>' +
				'<td>' + tmp.terlambat + '</td>' +
				'<td>' + tmp.sakit + '</td>' +
				'<td>' + tmp.izin + '</td>' +
				'<td>' + tmp.cuti + '</td>' +
				'<td>' + presentase + ' %</td>' +
				'</tr>';
		}

		page.change( $( '#table-rekap' ), html );
		
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {
			
			var reload = function() {
				
				setDataRekap( list, ++pageNumber );
				
			}

			data.timeoutVar = setTimeout( reload, data.timeout);
			
		} else {
			
			data.timeoutVar = setTimeout( reloadLoadNumber, data.timeout);
			
		}
	}
	
	function reloadLoadNumber() {
				
		if ( ( data.loaderNumber + 1 ) < listLoader.length ) {
					
			data.loaderNumber++;
					
		} else {
					
			data.loaderNumber = 0;
					
		}
				
		loadRekap();
				
	};
	
	function loadRanking() {
		
		page.load( $( '#content-absen' ), 'html/rekap.html');

	};
	
	function getColor( presentase ) {
		
		if ( presentase > 80 )
			return '';
		if ( presentase > 60)
			return '';
		return '';
	};

	// Handler
	$( document ).on( 'click', '#btn-rekap', function() {

		clearTimeout( data.timeoutVar );
		loadRekap();
		
	} );

	$( document ).on( 'click', '#btn-ranking', function() {

		clearTimeout( data.timeoutVar );
		loadRanking();

	} );
	
	$( document ).on( 'change', '#absen-tanggal-awal', function() {

		loadRekap();
		
	} );

	$( document ).on( 'change', '#absen-tanggal-akhir', function() {

		loadRekap();
		
	} );

	$( document ).on( 'change', '#absen-pilih', function() {

		data.pilih = $( '#absen-pilih' ).val();
		
		if ( !data.pilih)
			return;

		loadRekap();

	} );
});
