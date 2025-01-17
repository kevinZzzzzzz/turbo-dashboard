import React, { PureComponent } from "react";
import styles from "./index.module.scss";
class HomePage extends PureComponent<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <h1>Home Page</h1>
        <div className={styles.box}></div>
      </>
    );
  }
}

export default HomePage;
