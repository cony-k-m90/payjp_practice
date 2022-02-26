const pay = () => {
  Payjp.setPublicKey(process.env.PAYJP_PUBLIC_KEY); // PAY.JPテスト公開鍵の環境変数
  const submit = document.getElementById("button");
  submit.addEventListener("click", (e) => {
    e.preventDefault();

    const formResult = document.getElementById("charge-form");
    const formData = new FormData(formResult);

    const card = {
      number: formData.get("order[number]"),
      cvc: formData.get("order[cvc]"),
      exp_month: formData.get("order[exp_month]"),
      exp_year: `20${formData.get("order[exp_year]")}`,
    };

    Payjp.createToken(card, (status, response) => {
      if (status == 200) {
        const token = response.id;
        const renderDom = document.getElementById("charge-form");
        //valueは実際に送られる値、nameはその値を示すプロパティ名（params[:name]のように取得できるようになる）
        const tokenObj = `<input value=${token} name='token' type="hidden"> `;
        renderDom.insertAdjacentHTML("beforeend", tokenObj);
      }

      document.getElementById("order_number").removeAttribute("name");
      document.getElementById("order_cvc").removeAttribute("name");
      document.getElementById("order_exp_month").removeAttribute("name");
      document.getElementById("order_exp_year").removeAttribute("name");

      //下記の記述でフォームの情報をサーバーサイドに送信している。
      //5行目の e.preventDefault(); で通常のRuby on Railsにおけるフォーム送信処理はキャンセルされる。
      //したがって、下記のようにJavaScript側からフォームの送信処理を行う必要がある。
      document.getElementById("charge-form").submit();
    });
  });
};

window.addEventListener("load", pay);