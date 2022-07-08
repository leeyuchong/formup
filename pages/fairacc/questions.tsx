import { useRouter } from "next/router"
import { useEffect, useState } from "react";

function FairAccQuestions(props) {
    // console.log(props.query.f)
    const router = useRouter();
    // const [s, setS] = useState({});
    useEffect(() => {
        if (router.isReady) {
          // Code using query
          // console.log(router.query.f);
          // setS(router.query.f)
        }
      }, [router.isReady]);
    
    return(
    <div>
        <h1>hello</h1>
    </div>
    )
}

export default FairAccQuestions