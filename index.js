
const fs = require( 'fs' );
const yargs = require( 'yargs' );
const axios = require( 'axios' );
const matter = require( 'gray-matter' );
const marked = require( 'marked' );
var Mustache = require( 'mustache' );

// Retrieve env vars for sensitive creds etc.
// Example env file:
// WP_BASE_URL=https://myradioshow.com/wp-json/wp/v2/
// WP_USER=application_password_user
// WP_PASSWORD=application_password_s3cr4t_p1ssw88d
require('dotenv').config();

const argv = yargs(process.argv.slice(2))
    .command('post', 'Prep and post a post')
    .option('tracklist', {
        alias: 't',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

if ( ! argv.tracklist ) {
    console.error( 'No tracklist file provided' )
    exit;
}

// Read input tracklist file. 
// This file should be a markdown formatted tracklist (numbered list), 
// with yaml front matter with the following variables:
// title, tags, mixcloud_url, mixcloud_url_r1
// See sample-data folder for an example.
const file = matter.read( argv.tracklist );

// Render tracklist has html.
const tracklistHtml = marked.parse( file.content );

// Load the post template. 
const template = fs.readFileSync( './templates/beats-reality.mustache', 'utf8' );

const { 
    mixcloud_url,
    mixcloud_url_r1 
} = file.data;

// Render post content using template, variables, and tracklist html.
const postContent = Mustache.render( 
    template,
    {
        mixcloud_url,
        mixcloud_url_r1, 
        tracklistHtml,
    }
);

const url = `${ process.env.WP_BASE_URL }posts`;

console.log( `Using tracklist markdown file ${ argv.tracklist }`);
console.log( `POSTing to ${ url }`);

axios.post( url, {
    status: 'publish',
    content: postContent,
    title: file.data.title,

    // Excerpt is generated from tags.
    excerpt: file.data.tags.join( ' | ' ),

    // tags need to be passed as IDs for tags that already exist
    // coming sooon
    // tags: file.data.tags,
    }, {
        // Basic auth using WordPress application password.
        // https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/
        auth: {
            username: process.env.WP_USER,
            password: process.env.WP_PASSWORD
        },
    } 
).then(function (response) {
    console.log(`Success! Posted as ${ response.data.id }`);
})
.catch(function (error) {
    console.log(error);
});
