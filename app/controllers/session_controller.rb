class SessionController < ApplicationController
  def create
    session[:authentication] = Settings.authentication
    cookies.signed[:authentication] = {
      value: Settings.authentication,
      expires: 1.day.from_now,
      httponly: true
    }
  end
end
