<template>
  <div class="hello">
    <header id="header">
      <h1>header</h1>
    </header>
    <div class="content">
      <aside id="aside">
        <h1>aside</h1>
      </aside>
      <main id="main">
        <h1>main</h1>
      </main>
    </div>
    <footer id="footer">
      <h1>footer</h1>
    </footer>
  </div>
</template>

<script>
import Cabj from "../../../dist";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      requestId: 0,
      animationStartTime: 0
    };
  },
  created() {
    setTimeout(function() {
      let headerActor = new Cabj();
      let asideActor = new Cabj();
      let mainActor = new Cabj();
      let footerActor = new Cabj();
      let header = document.getElementById("header");
      let aside = document.getElementById("aside");
      let main = document.getElementById("main");
      let footer = document.getElementById("footer");
      headerActor
        .target(header)
        .to({ width: "100%" })
        .time(500)
        .when(function(step, degree, element) {
          element.style.opacity = degree;
        })
        .condition([
          {
            if: function(step, degree) {
              return degree > 0.9999;
            },
            do: function(step, degree, element) {
              element.style.borderRadius = "130px";
            }
          }
        ])
        .end(function() {
          mainActor.run();
        });
      mainActor
        .target(main)
        .to({ height: "100%" })
        .time(300)
        .when(function(step, degree, element) {
          element.style.opacity = degree;
        })
        .end(function() {
          footerActor.run();
        });
      footerActor
        .target(footer)
        .to({ width: "100%" })
        .time(200)
        .end(function() {
          asideActor.run();
        });
      asideActor
        .target(aside)
        .to({ height: "100%" })
        .time(300);

      headerActor.run();

      // headerActor
      //   .target(header)
      //   .to({ width: "100%" })
      //   .time(500)
      //   .run();
      // mainActor
      //   .target(main)
      //   .to({ height: "100%" })
      //   .time(500)
      //   .to({ backgroundColor: "pink" })
      //   .time(1500)
      //   .run();
      // footerActor
      //   .target(footer)
      //   .to({ width: "100%" })
      //   .time(500)
      //   .run();
      // asideActor
      //   .target(aside)
      //   .to({ height: "100%" })
      //   .time(500)
      //   .run();
    }, 1000);
  },
  methods: {
    animate() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100vh;
  width: 100vw;
}
header {
  position: relative;
  overflow: hidden;
  width: 0;
  height: 3rem;
  background-color: orange;
}
.content {
  position: relative;
  width: 100vw;
  height: calc(100vh - 6rem);
}
aside {
  position: absolute;
  overflow: hidden;
  left: 0;
  bottom: 0;
  width: 220px;
  height: 0;
  background-color: aquamarine;
}
main {
  position: absolute;
  overflow: hidden;
  right: 0;
  display: inline-block;
  width: calc(100% - 220px);
  height: 0;
  background-color: lightcoral;
}
footer {
  position: absolute;
  right: 0;
  overflow: hidden;
  width: 0;
  height: 3rem;
  background-color: lightblue;
}
</style>
