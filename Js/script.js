// load the page
getHomeMeals('search.php?s=')
//////

// ***********************************************

// Global variables

// ***********************************************
let homeMeals = document.getElementById('pageData')
let namePattern = /^[A-Za-z]{3,}$/;
let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
let phonePattern = /^01[0125]\d{8}$/;
let agePattern = /^\d{1,3}$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ***********************************************

// Fetching data functions

// ***********************************************
async function getHomeMeals (endPoint) {
    $('.loader-holder').show();

    let meals = ``
    try {
        let data = await fetch(`https://www.themealdb.com/api/json/v1/1/${endPoint}`)
        let result = await data.json()
        console.log(result)
        for (let i=0; i<result.meals.length && i<20; i++){


            meals += `
             <div class="col-md-3 col-md  ">
                <div class="meal-item  "  onclick="getMealRecipe(${result.meals[i].idMeal})">
                    <img class="rec-img" src=${result.meals[i].strMealThumb}>
                    <div class="meal-name-box ">
                        <h1 class="meal-name">${result.meals[i].strMeal}</h1>
                </div>
                </div>
            </div>
            
     
            `
        }

        homeMeals.innerHTML = meals;

    } catch (error) {
        console.error('Error:', error);
    }

    $('.loader-holder').hide('slow');
}
async function getMealRecipe (mealId) {
    $('.loader-holder').show();
    $('.search-bar').css('height', '0');
    let meal = ``
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    let result = await data.json()
    let ingredients = getIngredients(result.meals[0]);
    let tagsBox =``
    let ingredientsBox = ``

    ///// Loop for ingredients

    for (let i =0; i<ingredients.length; i++){
        ingredientsBox += `
          <div class="ingredient text-white">
             <p>${ingredients[i].ingredientMeasure} ${ingredients[i].ingredientType}</p>
           </div>
        `
    }
    ///////////////////////

    /////// loop for tags
    if (result.meals[0].strTags != null) {
        let tags = result.meals[0].strTags.split(',');
        for (let i =0; i<tags.length; i++){
            tagsBox += `
         <div class="tag-class">
                <p>${tags[i].trim()}</p> 
                </div>

        `
        }

    }


    meal =`
      <div class="col-md-4">
            <div class="p-3 m-3">
                <img class="recipeImage" src=${result.meals[0].strMealThumb}>
                <h1 class="text-white">${result.meals[0].strMeal}</h1>
            </div>


        </div>
        <div class="col-md-8">
            <div class="recipe-instructions p-3 m-3 text-white">
                <h2>Instructions</h2>
                <p>${result.meals[0].strInstructions}</p>
                <h2>Area: <span>${result.meals[0].strArea}</span> </h2>
                <h2>Category: <span>${result.meals[0].strCategory}</span> </h2>
                <h2>Ingredients:</h2>
                <div class="ingredients-wrapper w-75 d-flex flex-wrap flex-row ">
                ${ingredientsBox}
                </div>
                <h2>Tags:</h2>
                <div class='d-flex flex-row flex-wrap'>
               ${tagsBox}
                
                </div>
                
                <div class="d-flex flex-row ">
                <button onclick="window.open('${result.meals[0].strSource}', '_blank')" class="btn btn-success mx-2">Source</button>                
                <button onclick="window.open('${result.meals[0].strYoutube}', '_blank')" class="btn btn-danger">Youtube</button>
                </div>

            </div>

        </div>
    
    
    `
    homeMeals.innerHTML =meal;
    $('.loader-holder').hide('slow');
}
async function listCategories () {
    $('.loader-holder').show();
    let result = await  fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    let data = await result.json()
    console.log(data)

    let categories = ``
    for (let i=0; i<data.categories.length; i++){
        categories += `
            <div class="col-md-3 col-md  ">
                <div class="meal-item  "  onclick="getHomeMeals('filter.php?c=${data.categories[i].strCategory}')">
                    <img class="rec-img" src=${data.categories[i].strCategoryThumb}>
                    <div class="meal-name-box d-flex flex-column justify-content-start align-items-center ">
                        <h1 class="">${data.categories[i].strCategory}</h1>
                        <p class="p-2">${data.categories[i].strCategoryDescription}</p>
                </div>
                </div>
            </div>
        
        `

    }

    homeMeals.innerHTML = categories;
    $('.loader-holder').hide('slow');

}
async  function getAreas () {
    $('.loader-holder').show();
    let areas = ``
    let result = await  fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    let data = await result.json()
    for (let i =0; i<data.meals.length; i++) {

        areas += `
           <div class="col-md-3 col-md text-white  ">
                <div class="d-flex cursor-hover flex-column m-3 align-items-center justify-content-center " 
                 onclick="getHomeMeals('filter.php?a=${data.meals[i].strArea}')">
                    <i class="fa-solid fa-house area-icons"></i>
                    <h2>${data.meals[i].strArea}</h2>
                </div>
            </div>
       
        `
    }

    homeMeals.innerHTML = areas;
    $('.loader-holder').hide('slow');
}
async function filterIngredients () {
    $('.loader-holder').show();
    let ingredientsBox = ``
    let result = await  fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=')
    let data = await result.json()


    for (let i =0; i<20; i++){
        let description = data.meals[i].strDescription.substring(0, 100);
        console.log(data.meals[i].strIngredient)
        ingredientsBox += `
           <div class="col-md-3 col-md text-white text-center  ">
                <div class="d-flex cursor-hover flex-column m-3 align-items-center justify-content-center " 
                 onclick="getHomeMeals('filter.php?i=${data.meals[i].strIngredient}')">
                    <i class="fa-solid fa-drumstick-bite area-icons"></i>
                    <h2>${data.meals[i].strIngredient}</h2>
                    <p>${description}</p>
                </div>
            </div>
        
        `
    }
    homeMeals.innerHTML = ingredientsBox;
    $('.loader-holder').hide('slow');
}

// ***********************************************

// Helper functions

// ***********************************************
function getIngredients(meal) {
    $('.search-bar').css('height', '0');

    let ingredient = {
        ingredientMeasure: String,
        ingredientType: String,
    }
    let ingredients =[]


    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredient = {
                ingredientMeasure: meal[`strMeasure${i}`],
                ingredientType: meal[`strIngredient${i}`]
            }
            ingredients.push(ingredient);
        } else {
            break;
        }
    }

    return ingredients;
}
function searchMealByName (mealName) {
    getHomeMeals(`search.php?s=${mealName}`)
}
function showForm() {
    homeMeals.innerHTML = `
<form class="form-holder ">
            <div class="d-flex flex-column text-white justify-content-center align-items-center   ">

            <div class="d-flex flex-row gap-5 mb-3 w-50 justify-content-center ">
            
            <div class="d-flex flex-column justify-content-start w-50">
                 <input id="nameInput" class="form-control" type="text" placeholder="Enter your name" >
                <span id="nameStatus"></span> 
        
            </div>
       
        <div class="d-flex flex-column w-50">
    <input id="emailInput" class="form-control" type="email" placeholder="Enter your email" >
        <span id="emailStatus"></span> 
        </div>
        </div>
        
 
         <div class="d-flex flex-row gap-5 mb-3 w-50 justify-content-center">
         <div class="d-flex flex-column w-50">
            <input id="phoneInput" class="form-control" type="tel" placeholder="Enter your phone number" >
        <span id="phoneStatus"></span> 
        </div>
        
         <div class="d-flex flex-column w-50">
    <input id="ageInput"  class="form-control " type="number" placeholder="Enter your age" >
        <span id="ageStatus"></span> 
         </div>
         </div>

     <div class="d-flex flex-row gap-5 mb-3 w-50  justify-content-center">
     
       <div class="d-flex flex-column w-50">
            <input id="passwordInput" class="form-control" type="password" placeholder="Enter your password" >
        <span id="passwordStatus"></span> 
        </div>
        
          <div class="d-flex flex-column w-50">
    <input id="confirmPasswordInput" class="form-control" type="password" placeholder="Enter your password" >
        <span id="confirmPasswordStatus"></span> 
         </div>
</div>
         <button id="submit" class="btn btn-danger ">Submit</button>
</div>
</form>
    `

    $('#submit').prop('disabled', true);
    regexTest()


}
function regexTest() {
    $('#nameInput').on('input', function() {
        let isValidName = namePattern.test($(this).val());
        $('#nameStatus').text(isValidName ? '' : 'Enter a valid name');
        checkAllInputs();
    });

    $('#emailInput').on('input', function() {
        let isValidEmail = emailPattern.test($(this).val());
        $('#emailStatus').text(isValidEmail ? '' : 'Enter a valid email');
        checkAllInputs();
    });

    $('#phoneInput').on('input', function() {
        let isValidPhone = phonePattern.test($(this).val());
        $('#phoneStatus').text(isValidPhone ? '' :
            'Enter a valid phone number that starts with 010,011,012, or 015');
        checkAllInputs();
    });

    $('#ageInput').on('input', function() {
        let isValidAge = agePattern.test($(this).val());
        $('#ageStatus').text(isValidAge ? '' : 'Enter a valid age');
        checkAllInputs();
    });

    $('#passwordInput').on('input', function() {
        let isValidPassword = passwordPattern.test($(this).val());
        $('#passwordStatus').text(isValidPassword ? '' :
            'Your password should be at least 8 characters and have at least one small letter, one capital letter, one number, and one special symbol ');
        checkAllInputs();
    });

    $('#confirmPasswordInput').on('input', function() {
        let isPasswordMatch = $('#passwordInput').val() === $(this).val();
        $('#confirmPasswordStatus').text(isPasswordMatch ? 'Passwords match' : 'Passwords do not match');
        checkAllInputs();
    });
}
function checkAllInputs() {
    let isValidName = namePattern.test($('#nameInput').val());
    let isValidEmail = emailPattern.test($('#emailInput').val());
    let isValidPhone = phonePattern.test($('#phoneInput').val());
    let isValidAge = agePattern.test($('#ageInput').val());
    let isValidPassword = passwordPattern.test($('#passwordInput').val());
    let isPasswordMatch = $('#passwordInput').val() === $('#confirmPasswordInput').val();

    if (isValidName && isValidEmail && isValidPhone && isValidAge && isValidPassword && isPasswordMatch) {
        $('.btn').prop('disabled', false);
    } else {
        $('.btn').prop('disabled', true);
    }
}

// ***********************************************

// Navigation functions

// ***********************************************
function openNav() {
    $("#wrapper").animate({left: "250px"}, 500, function() {
        $('#openIcon').removeClass('fa-bars').addClass('fa-xmark');
    });
    $(".fixedBar").animate({left: "250px"}, 500);
    $('#mySidenav').animate({left: '0'},500, function () {
        $('#mySidenav a').each(function(index) {
            $(this).delay(100*index).animate({top: '0', opacity: '1'}, 200);
        });
    })
}
function closeNav() {
    $("#wrapper").animate({left: "0"}, 500, function() {
        $('#openIcon').removeClass('fa-xmark').addClass('fa-bars');
    });
    $(".fixedBar").animate({left: "0"}, 500);
    $('#mySidenav').animate({left: '-250'},500, function () {
        $('#mySidenav a').each(function() {
            $(this).css({top: '100px', opacity: '0'});
        });
    })

}

// ***********************************************

// Event listeners

// ***********************************************
$('#clickHome').click(function () {
    getHomeMeals('search.php?s=')
})
$('#openIcon').click(function() {
    if ($(this).hasClass('fa-bars')) {
        openNav();
    } else if ($(this).hasClass('fa-xmark')) {
        closeNav();
    }
});
$('#searchTag').click(function () {
    closeNav();
    $('#pageData').html('');
    $('.search-bar').css('height', '100%');
});
$('#searchName').keyup(function () {
    let name = this.value
    if (name.length >= 2) {
        searchMealByName(name)
    }


})
$('#categoryTag').click(function () {
    $('.search-bar').css('height', '0');

    closeNav();
    listCategories()
})
$('#areaTag').click(function () {
    $('.search-bar').css('height', '0');

    closeNav();
    getAreas();

})
$('#searchLetter').keyup(function () {
   let firstLetter = this.value
    if (firstLetter.length !== 0 ){
        getHomeMeals(`search.php?f=${firstLetter}`)
    }

})
$('#ingTag').click(function () {
    closeNav()
    filterIngredients()
})
$('#contactTag').click(function () {
    $('.search-bar').css('height', '0');

    closeNav()
    showForm()

})

// ***********************************************

// End of code
// Created by Eng.Abdallah Osama Elhanafy

