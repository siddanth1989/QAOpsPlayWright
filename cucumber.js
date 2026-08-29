module.exports = {
  default: {
    publishQuiet: true
  }
};

//npx cucumber-js features/EcommerceParallel.feature --parallel 2  --exit --format html:cucumber-report.html
//npx cucumber-js --tags "@ValidationParameterized"  --exit