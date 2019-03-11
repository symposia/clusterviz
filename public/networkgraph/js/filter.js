function filter(data) {
    var newsSources = []
    var exists = [];
    var filtered = false;

    for(let el in data) {
        var node = data[el];
        if (!exists.includes(node.sourceName)) {
            exists.push(node.sourceName);
            newsSources.push({"sourceName": node.sourceName, "url": node.url});
        }
     }

    // data.forEach(function(n, ix) {
    //     var node = n[ix];
    //     if (!exists.includes(node.sourceName)) {
    //         exists.push(node.sourceName);
    //         newsSources.push({"sourceName": node.sourceName, "url": node.url});
    //     }
    // })

    typeFilterList = exists;
    console.log(typeFilterList);

    // Events
    $('.dropdown-container')
        .on('click', '.dropdown-button', function() {
            $(this).siblings('.dropdown-list').toggle();
        })
        .on('click', '.reset-btn', function() {
            typeFilterList = exists;
            $(":checkbox").prop("checked", false);
            console.log(typeFilterList);
            filtered = false;
            set_focus();
        })
        .on('input', '.dropdown-search', function() {
            var target = $(this);
            var dropdownList = target.closest('.dropdown-list');
            var search = target.val().toLowerCase();

            if (!search) {
                dropdownList.find('li').show();
                return false;
            }

            dropdownList.find('li').each(function() {
                var text = $(this).text().toLowerCase();
                var match = text.indexOf(search) > -1;
                $(this).toggle(match);
            });
        })
        .on('change', '[type="checkbox"]', function() {
            if (!filtered) {
                typeFilterList = []
                filtered = true;
            }

            if (this.checked) {
                typeFilterList.push($(this).attr("name"));
                set_focus();
            } else {
                typeFilterList.splice(typeFilterList.indexOf('foo'), 1);
                if (typeFilterList.length === 0) {
                    typeFilterList = exists;
                    filtered = false;
                }
                set_focus();
            }

            console.log(typeFilterList);
            // var container = $(this).closest('.dropdown-container');
            // var numChecked = container. find('[type="checkbox"]:checked').length;
            // container.find('.quantity').text(numChecked || 'Any');
        });

    // var newsSources = data.forEach(function(n, ix) {
    //     var node = data[ix];
    //     return {"sourceName": node.}
    // })

    // var newsSources = _.keys(_.countBy(data, function(data, ix) {
    //     var node = data[ix]
    //     return node.sourceName;
    // }));

    // console.log(newsSources);

    // usStates.forEach(function(s) {
    //     console.log(s)
    //     $('ul').append(
    //         $('<li>').append (
    //             $('input').attr('name', s.name).attr('type', 'checkbox').append(
    //                 $('label').attr('for', s.name).append(s.name)
    //     )));
    // })

    // <li> template
    var stateTemplate = _.template(
        '<li>' +
            '<input name="<%= sourceName %>" type="checkbox">' +
            '<label for="<%= sourceName %>"><%= sourceName %></label>' +
        '</li>'
    );

    // Populate list with states
    _.each(newsSources, function(s) {
        //s.capName = _.startCase(s.name.toLowerCase());
        $('ul').append(stateTemplate(s));
    });

    // usStates.forEach(function(s) {
    //     console.log(s)
    //     $('ul').append(stateTemplate(s));
    // })
}
