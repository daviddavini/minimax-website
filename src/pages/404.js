import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

// Python
// f = (lambda x : x**2)
// which is the same as
// def f(x):
//    return x**2
// x = [i**2 for i in range(10)] -- not available in JS :(
// Javascript
// var f = ( (x) => x*x )

// Python
// a = 5
// a = 3
// Javascript
// var a = 5  (or let, const)
// a = 3
// var -- function-scoped
// let -- block-scoped (brackets)
// const -- just a constant (no reassignment) thats block-scoped

const NotFoundPage = () => (
  // JSX -- just HTML with some React (HTML++)
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export default NotFoundPage
