/*jshint camelcase: false */
(function () {
    'use strict';

    /*
     * Smooth scroll to sections with an offset
     */
    $('a.scroll').on('click', function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $($(this).attr('href')).offset().top - 85
        }, 250);
        return false;
    });

    /*
     * Toggles the nav.sticky class based on scrollTop
     */
    var lastScrollPos = 0;
    var adjustNav = function (scrollPos) {
        if (scrollPos > 100 && lastScrollPos < scrollPos) {
            $('nav').addClass('sticky');
        } else if (scrollPos <= 100 && lastScrollPos > scrollPos) {
            $('nav').removeClass('sticky');
        }
        lastScrollPos = scrollPos;
    };

    /*
     * Adds a 1/2 parallax effect to the hero bg
     */
    var hero = $('.hero');
    // var adjustHeroParallax = function (scrollPos) {
    //   if (scrollPos < hero[0].offsetHeight) {
    //     hero.css('backgroundPosition', '50% ' + (scrollPos/2 - 75) + 'px');
    //   }
    // };


    // scroll listener
    $(document).on('scroll', function () {
        var scrollTop = $(document).scrollTop();
        adjustNav(scrollTop);
        //adjustHeroParallax(scrollTop);
    });


    /*
     * Cycles hero subtitle text
     */
    var titles = ['beautiful experiences.', 'intuitive interfaces.', 'clean APIs.', 'scalable architectures.', 'productive software.'];
    var idx = 0;
    var swapEl = $('.swap');
    var stagingEl = $('<strong style="top: 25px; opacity: 0;" class="swap"></strong>');
    setInterval(function () {
        if ($(document).scrollTop() <= hero[0].offsetHeight) {
            idx = ++idx % titles.length;
            var t = titles[idx];
            stagingEl.css({ top: '25px', opacity: 0 });
            swapEl.animate({ opacity: 0, top: '-25px' }, 200, function () {
                stagingEl.text(t);
                stagingEl.insertAfter(swapEl);
                swapEl.remove();
                var tmp = swapEl;
                swapEl = stagingEl;
                stagingEl = tmp;
                swapEl.animate({ opacity: 1, top: '0px' }, 200);
            });
        }
    }, 2000);

    var technologiesLookup = {
        'grunt': {
            url: 'http://www.gruntjs.com',
            logo: 'images/technology_logos/grunt.svg'
        },
        'angularjs': {
            url: 'http://www.angularjs.org',
            logo: 'images/technology_logos/angularjs.png'
        },
        'angular': {
            url: 'http://www.angularjs.org',
            logo: 'images/technology_logos/angularjs.png'
        },
        'bower': {
            url: 'http://bower.io/',
            logo: 'images/technology_logos/bower.png'
        },
        'gulp': {
            url: 'http://gulpjs.com/',
            logo: 'images/technology_logos/gulp.png'
        },
        'accumulo': {
            url: 'https://accumulo.apache.org/',
            logo: 'images/technology_logos/accumulo.png'
        },
        'hadoop': {
            url: 'https://hadoop.apache.org/',
            logo: 'images/technology_logos/hadoop.svg'
        },
        'mongoose': {
            url: 'https://www.mongodb.com',
            logo: 'images/technology_logos/mongodb.png'
        },
        'nodejs': {
            url: 'https://nodejs.org',
            logo: 'images/technology_logos/nodejs.png'
        },
        'reactjs': {
            url: 'http://www.reactjs.org',
            logo: 'images/technology_logos/reactjs.svg'
        },
        'react': {
            url: 'http://www.reactjs.org',
            logo: 'images/technology_logos/reactjs.svg'
        }
    };

    var languages = {
        'javascript': true,
        'java': true,
        'scala': true
    };

    var projectsToTechnologiesMap = {
        'permissive': ['angular']
    };

    /**
     * Gets the js technologies used for a js type repo
     */
    function getJSTechnologies(repo) {
        // Most should have a package.json
        var url = repo.html_url.replace('github.com', 'cdn.rawgit.com') + '/' + repo.default_branch + '/package.json';
        return $.get(url).then(function(resp) {
            var technologies = [technologiesLookup.nodejs];
            var depsToLookThrough = $.extend({}, resp.devDependencies, resp.dependencies);
            for (var dep in depsToLookThrough) {
                if (technologiesLookup[dep]) {
                    technologies.push(technologiesLookup[dep]);
                }
            }
            return technologies;
        });
    }

    /**
     * Gets the js technologies used for a java type repo
     */
    function getJavaTechnologies(repo) {
        // Check for a pom
        var url = repo.html_url.replace('github.com', 'cdn.rawgit.com') + '/' + repo.default_branch + '/pom.xml';
        return $.get(url).then(function(resp) {
            var technologies = [];

            // Try it as a document
            var text = resp;
            if (typeof resp === 'object') {
                text = $(resp).find('dependency groupId').text();
            }

            if (text.indexOf('org.apache.accumulo') >= 0) {
                technologies.push(technologiesLookup.accumulo);
            }
            if (text.indexOf('org.apache.hadoop') >= 0) {
                technologies.push(technologiesLookup.hadoop);
            }

            return technologies;
        });
    }

    /**
     * Gets the technologies used in a repo
     */
    function getTechnologies(repo) {
        var language = repo.language.toLowerCase();
        var result;
        if (language === 'javascript') {
            result = getJSTechnologies(repo);
        } else if (language === 'java') {
            result = getJavaTechnologies(repo);
        } else {
            result = getJavaTechnologies(repo);
        }

        result.then(function (technologies) {
            var additionalTech = projectsToTechnologiesMap[repo.name];
            if (additionalTech && additionalTech.length) {
                for (var i = 0; i < additionalTech.length; i++) {
                    technologies.push(technologiesLookup[additionalTech[i]]);
                }
            }
            return technologies;
        });

        return result;
    }

    function buildProjectElement(repo) {
        var language = repo.language.toLowerCase();
        var eleHtml =
            '<section class="col-sm-4 card">' +
                '<div class="copy">' +
                    '<h3>' +
                        '<a class="excerpt" href="' + repo.html_url + '" target="_blank">' +
                            (languages[language] ?
                                '<img style="width:40px;margin-right:10px" src="images/language_logos/' + language + '_small.png"/>' :
                                '') +
                            repo.name +
                            '&nbsp<span class="stars pull-right">' + repo.stargazers_count + '&nbsp;<i class="fa fa-star icon"></i></span>' +
                        '</a>' +
                    '</h3>' +
                    '<p>' + repo.description + '</p>' +
                    '<div class="technologies">' +
                        '<strong style="font-size: 1.2em">Technologies:</strong>' +
                        '<br>' +
                    '</div>' +
                '</div>' +
            '</section>';
        var ele = $(eleHtml);
        var techEle = ele.find('.technologies');
        techEle.hide();

        getTechnologies(repo).then(function (technologies) {
            var techEles = [];
            for (var i = 0; i < technologies.length; i++) {
                techEles.push($('<a href="' + technologies[i].url + '" target="_blank" style="margin:5px"><img style="height:40px" src="' + technologies[i].logo + '"/></a>'));
            }

            if (technologies.length > 0) {
                techEle.append(techEles);
                techEle.show();
            }
        });
        return ele;
    }


    function getRepoList() {
        return $.get('scripts/test-data/repos.json');
        // return $.get('//api.github.com/orgs/atsid/repos');
    }

    /**
     * Builds the popular repo list from the list of repos
     */
    function buildPopularRepoList(repos) {
        var projectContainer = $('#popular-projects');
        var elements = [];
        repos.sort(function (a, b) {
            return b.stargazers_count - a.stargazers_count;
        });
        var popularRepos = repos.slice(0, 6);
        var parentEle;
        for (var i = 0; i < popularRepos.length; i++) {
            if (i % 3 === 0) {
                parentEle = $('<div class="row">');
                elements.push(parentEle);
            }
            var repo = popularRepos[i];
            if (repo.private === false) {
                parentEle.append(buildProjectElement(repo));
            }
        }
        projectContainer.append(elements);
    }

    /**
     * Calculate various stats about the given repos
     */
    function calculateStats(repos) {
        var highestLanguage = { count : -1 };
        var languageCounts = {};
        var languages = [];
        var numberOfIssues = 0;
        for (var i = 0; i < repos.length; i++) {
            numberOfIssues += repos[i].open_issues_count;
            var languageCount = languageCounts[repos[i].language] = (languageCounts[repos[i].language] || 0) + 1;
            if (languageCount > highestLanguage.count) {
                highestLanguage = { language: repos[i].language, count: languageCount };
            }

            if (languages.indexOf(repos[i].language) < 0) {
                languages.push(repos[i].language);
            }
        }

        $('#number-of-repos-stat').text(repos.length);
        $('#average-issues-stat').text(Math.round(numberOfIssues / repos.length));
        $('#language-stat').text(highestLanguage.language);
        $('#languages-stat').text(languages.join(', '));
    }

    /**
     * Builds the various project data
     */
    function buildProjectData() {
        getRepoList()
            .then(function (resp) {
                buildPopularRepoList(resp);
                calculateStats(resp);
            });
    }

    buildProjectData();

})();
