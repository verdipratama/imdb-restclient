function loadingGif(cond) {
    if (cond == 'show') {
        $('#movie-list').after(`<div class="loading-gif text-center">
        <div class="spinner-border" style="width: 6rem; height: 6rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <h3 class="mt-2">Loading, Please wait.</h3>
        </div>`);
    } else if (cond == 'hide') {
        $('.loading-gif').remove();
    }
}

function searchMovie() {
    if ($('#search-input').val() == '') {
        // if ($('#search-warning').length) {
        $('.input-group').after('<small class="text-danger ml-2" id="search-warning">*Keywords must be filled</small>');
        // }
        $('#search-input').addClass('is-invalid');
    } else {
        loadingGif('show');
        $('#movie-list').html('');
        $.ajax({
            type: "get",
            url: "http://www.omdbapi.com/",
            data: {
                'apikey': 'a4fe3962',
                's': $('#search-input').val()
            },
            dataType: "json",
            success: function (result) {
                loadingGif('hide');
                if (result.Response == "True") {
                    let movies = result.Search;
                    $.each(movies, function (index, data) {
                        $('#movie-list').append(`
                    <div class="col-md-4">
                        <div class="card mb-3">
                        <img src="${data.Poster}" onerror="this.src='imagenotavailable.png';" class="card-img-top">
                        <div class="card-body">
                        <h5 class="card-title">${data.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${data.Year}</h6>
                        <a href="" class="card-link movieDetail" data-id="${data.imdbID}" data-toggle="modal" data-target="#detailModal" >Detail</a>
                     </div>
                   </div>
                   </div>`);
                    });
                    $('#search-input').val('');
                } else {
                    $('#movie-list').html(`
                <div class="col">
                <h1 class="text-center"> ${result.Error}</h1>
                </div>`);
                }
            }
        });
    }
}
$('#search-button').on('click', function () {
    $('#search-warning').remove();
    searchMovie();
});
$('#search-input').on('keyup', function (e) {
    $(this).removeClass('is-invalid')
    $('#search-warning').remove();
    if (e.keyCode === 13) {
        searchMovie();
    }
});

$('#movie-list').on('click', '.movieDetail', function () {
    $('.modal-body').html(`<div class="d-flex justify-content-center">
                                <div class="spinner-border" style="width: 6rem; height: 6rem;" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                            <h4 class="text-center mt-4"> Please wait . . . </h4>`);
    $.ajax({
        type: "GET",
        url: "http://omdbapi.com",
        data: {
            'apikey': 'a4fe3962',
            'i': $(this).data('id'),
            'plot': 'full'
        },
        dataType: "json",
        success: function (movie) {
            if (movie.Response === "True") {
                $('.modal-title').html(`<b>${movie.Title}</b>`);
                $('.modal-body').html(`
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${movie.Poster}" onerror="this.src='imagenotavailable.png';" class="img-fluid">
                        </div>

                        <div class="col-md-8">
                            <ul class="list-group">
                                <li class="list-group-item"><b>IMDB Rating :</b> ${movie.imdbRating}/10</li>
                                <li class="list-group-item"><b>Release :</b> ${movie.Released}</li>
                                <li class="list-group-item"><b>Genre :</b> ${movie.Genre}</li>
                                <li class="list-group-item"><b>Runtime :</b> ${movie.Runtime}</li>
                                <li class="list-group-item"><b>Language :</b> ${movie.Language}</li>
                                <li class="list-group-item"><b>Country :</b> ${movie.Country}</li>
                                <li class="list-group-item"><b>Plot :</b> ${movie.Plot}</li>

                            </ul>
                        </div>
                    </div>
                </div>
                `);
            } else {
                $('.modal-body').html(`
                <div class="col">
                <h1 class="text-center"> ${result.Error}</h1>
                </div>`);
            }
        }
    });
});