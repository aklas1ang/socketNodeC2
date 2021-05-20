$(document).ready(function () {
    let socket = io();

    socket.on('connect', function () {
        console.log('Connected to Server');
    });

    socket.on('disconnect', function () {
        console.log('Disconnected from Server');
    });

    socket.on('newMessage', function (message) {
        const formattedTime = moment(message.createdAt).format('LT');
        console.log('This is a Message', message)
        $('#messageForm').append(`<li>${message.from} ${formattedTime} : ${message.text}</li>`);
          
        // const template = $('#messageTemplate').text();
        // $('#messageForm').append(mustache.render(template, {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: formattedTime
        // }));
    });

    socket.on('newLocationMessage', function (message) {
        const formattedTime = moment(message.createdAt).format('LT');
        console.log('newLocationMessage', message);
        $('#messageForm').append(`<li>${message.from} ${formattedTime} : <a target="_blank" href="${message.url}">My Current Location</a></li>`);
    });


    $('#submit').on('click', function (event) {
        event.preventDefault();

        socket.emit('createMessage', {
            from: "Joshua",
            text: $('input[name="message"]').val()
        }, function () {

        });
    });

    $('#submitLocation').on('click', function (event) {
        event.preventDefault();

        if (!navigator.geolocation) {
            return alert('Geolocation is not supported by your browser');
        }

        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, function () {
            alert('Unable to fetch Location');
        });
    });
});