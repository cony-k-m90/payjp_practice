class OrdersController < ApplicationController

  def index
    @order = Order.new
  end

  def create
    @order = Order.new(order_params)
    if @order.valid?
      pay_item
      @order.save
      return redirect_to root_path
    else
      render 'index'
    end
  end

  private

  def order_params
    params.require(:order).permit(:price).merge(token: params[:token])
  end

  def pay_item
    Payjp.api_key = ENV["PAYJP_SECRET_KEY"]
    Payjp::Charge.create(
      amount: order_params[:price],  #商品の値段
      card: order_params[:token],     #カードトークン
      currency: 'jpy'                 #通貨の種類（日本円）
    )
  end

end