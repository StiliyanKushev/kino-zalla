# make the component folder
mkdir ./src/components/$1

# add js and css files in it
touch ./src/components/$1/$1.css
touch ./src/components/$1/$1.js

# fill the js file with a template
echo "
import './$1.css';

function $1() {
    return (
        <>
            $1
        </>
    );
}

export default $1;" >> ./src/components/$1/$1.js