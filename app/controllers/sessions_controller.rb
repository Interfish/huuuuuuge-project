class SessionsController < ApplicationController
  def create
    if params.require('passcode') == Rails.application.credentials[Rails.env.to_sym][:passcode]
      cookies.signed[:passcode] = {
        value: Rails.application.credentials[Rails.env.to_sym][:passcode],
        expires: 1.day.from_now,
        httponly: true
      }
      status = 200
      message = 'login successfully'
    else
      status = 400
      message = 'login failed'
    end
    render json: { message: message }, status: status
  end

  def destroy
  end
end
