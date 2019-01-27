// --- Support Func ---
const bakeCookie = (...args) => {
  let date = new Date();
  date.setFullYear(2030); // Expire in 2030
  args.forEach(v => {
    document.cookie = `${v.name}=${v.val};expires=${date.toUTCString()};path=/;`;
  });
}
const eatCookie = () => {
  let temp = document.cookie.split(";");
  let cookieArr = {};
  temp.forEach((c,i) => {
    cookieArr[c.split("=")[0]] = c.split("=")[1];
  });
  return cookieArr;
}
// --- Calculate ---
// Males
const bodyFat_male = (weight,waist) => 100*(weight - (weight*1.082 + 94.42 - waist*4.15))/weight;
const bmr_male = (weight,height,age) => 66 + 6.23*weight+12.7*height-6.8*age;
// Females
const bodyFat_female = (weight,wrist,waist,hip,forearm) => {
  const factor1 = weight * .732 + 8.987;
  const factor2 = wrist/3.14;
  const factor3 = waist*.157;
  const factor4 = hip*.249;
  const factor5 = forearm*.434;
  return 100*(weight - (factor1 + factor2 - factor3 - factor4 + factor5))/weight;
}
const bmr_female = (weight,height,age) => 655 + 4.35*weight+4.7*height-4.7*age;
// Any
const bmi = (weight,height) => weight*703/Math.pow(height,2);
const waistToHipRatio = (waist,hip) => waist/hip;

// --- Output ---
const validate = (female=false) => {
  let checkArr = ["age","weight","height","waist","wrist","hips","forearm"];
  let check = true;
  if(female){
    for(let i=0;i<checkArr.length;i++){
      if($(`#${checkArr[i]}`).val() == "") check = false;
    }
  }else{
    for(let i=0;i<5;i++){
      if($(`#${checkArr[i]}`).val() == "") check = false;
    }
  }
  return check;
}
const BMI_Color = bmi => {
  if(bmi<=18.5) return ["warning","Underweight"]; // Underweight
  else if(bmi>18.5 && bmi<=24.99) return ["success","Normal Weight"]; // Normal Weight
  else if(bmi>24.99 && bmi<=29.99) return ["warning","Overweight"]; // Overweight
  else if(bmi>29.99 && bmi<=34.99) return ["danger","Obese (class 1)"];
  else if(bmi>34.99 && bmi<=39.99) return ["danger","Obese (class 2)"];
  else if(bmi>39.99) return ["danger","Morbid Obesity"]; // Class 1
}
const W2H_Color = (w2h,gender) => {
  if(gender == "Male"){
    if(w2h<=.95) return ["success","Low Risk"];
    else if(w2h>.95 && w2h<=1) return ["warning","Moderate Risk"];
    else if(w2h>1) return ["danger","High Risk"];
  }else{
    if(w2h<=.80) return ["success","Low Risk"];
    else if(w2h>.80 && w2h<=.85) return ["warning","Moderate Risk"];
    else if(w2h>.85) return ["danger","High Risk"];
  }
}
const BFP_Color = (bfp,gender) => {
  if(gender == "Male"){
    if(bfp<=4) return ["warning","Almost no fat"];
    else if(bfp>4 && bfp<=13) return ["success","Atheltic"];
    else if(bfp>13 && bfp<=17) return ["success","Fit"];
    else if(bfp>17 && bfp<=25) return ["warning","Acceptable"];
    else if(bfp>25) return ["danger","Obese"];
  }else{
    if(bfp<=12) return ["warning","Almost no fat"];
    else if(bfp>12 && bfp<=20) return ["success","Atheltic"];
    else if(bfp>20 && bfp<=24) return ["success","Fit"];
    else if(bfp>24 && bfp<=31) return ["warning","Acceptable"];
    else if(bfp>31) return ["danger","Obese"];
  }
}
const display = (bfp,bmr,bmi_m,w2h) => {
  $("#bodyFat_body").html(`<h3>${bfp.toFixed(2)}%</h3>
  <p>This is considered "${BFP_Color(bfp,$("#gender").val())[1]}"</p>`);
  $("#bodyFat").addClass(`border-${BFP_Color(bfp,$("#gender").val())[0]}`);

  $("#BMI_body").html(`<h3>${bmi_m.toFixed(2)}</h3>
  <p>This is considered "${BMI_Color(bmi_m)[1]}"</p>`);
  $("#BMI").addClass(`border-${BMI_Color(bmi_m)[0]}`);

  $("#BMR_body").html(`<h3>${bmr.toFixed(2)} cal</h3>`);

  $("#whRatio_body").html(`<h3>${w2h.toFixed(2)}</h3>
  <p>This is considered "${W2H_Color(w2h,$("#gender").val())[1]}"</p>`);
  $("#whRatio").addClass(`border-${W2H_Color(w2h,$("#gender").val())[0]}`);
}
const calculate = () => {
  let gender = $("#gender").val();
  if(gender == "Male"){
    const weight = Number($("#weight").val());
    const waist = Number($("#waist").val());
    const height = Number($("#height").val());
    const age = Number($("#age").val());
    const hip = Number($("#hips").val());

    // --- Calculations ---
    const bfp = bodyFat_male(weight,waist);
    const bmr = bmr_male(weight,height,age);
    const bmi_m = bmi(weight,height);
    const w2h = waistToHipRatio(waist,hip);

    display(bfp,bmr,bmi_m,w2h);
  }else{
    const weight = Number($("#weight").val());
    const waist = Number($("#waist").val());
    const wrist = Number($("#wrist").val());
    const height = Number($("#height").val());
    const forearm = Number($("#forearm").val());
    const age = Number($("#age").val());
    const hip = Number($("#hips").val());
    // --- Calculations ---
    const bfp = bodyFat_female(weight,wrist,waist,hip,forearm);
    const bmr = bmr_female(weight,height,age);
    const bmi_m = bmi(weight,height);
    const w2h = waistToHipRatio(waist,hip);

    display(bfp,bmr,bmi_m,w2h);
  }
}
$(document).ready(function(){
  $("#calcButton").click(function(e){
    e.preventDefault();
    if($("#gender").val() == "Male"){
      if(validate()){
        $("#textDisplay").html("Note: cookies will expire automatically in 2030.");
        calculate();
      }else{
        $("#textDisplay").html("<span class='text-danger'>One or more boxes hasn't been filled!</span>  Note, males need only the first four boxes!");
      }
    }else{
      if(validate(true)){
        $("#textDisplay").html("Note: cookies will expire automatically in 2030.");
        calculate();
      }else{
        $("#textDisplay").html("<span class='text-danger'>One or more boxes hasn't been filled!</span>");
      }
    }
  });
  $("#saveInfo").click(function(e){
    e.preventDefault();
    let cookie = bakeCookie(
      {"name":"age","val":$("#age").val()},
      {"name":"weight","val":$("#weight").val()},
      {"name":"height","val":$("#height").val()},
      {"name":"waist","val":$("#waist").val()},
      {"name":"wrist","val":$("#wrist").val()},
      {"name":"hips","val":$("#hips").val()},
      {"name":"forearm","val":$("#forearm").val()}
    );
    document.cookie=cookie;
  });
  $("#loadInfo").click(function(e){
    e.preventDefault();
    let cookies = eatCookie();
    $("#age").val(cookies[" age"]);
    $("#weight").val(cookies[" weight"]);
    $("#height").val(cookies[" height"]);
    $("#waist").val(cookies[" waist"]);
    $("#wrist").val(cookies[" wrist"]);
    $("#hips").val(cookies[" hips"]);
    $("#forearm").val(cookies[" forearm"]);
  });
  $("#clearForm").click(function(e){
    e.preventDefault();
    $("#age").val("");
    $("#weight").val("");
    $("#height").val("");
    $("#waist").val("");
    $("#wrist").val("");
    $("#hips").val("");
    $("#forearm").val("");
  });
});
