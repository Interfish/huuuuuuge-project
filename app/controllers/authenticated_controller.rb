class AuthenticatedController < ApplicationController

  before_action :authenticate

  def authenticate
    unless cookies.encrypted[:passcode] == Rails.application.credentials[Rails.env.to_sym][:passcode]
      redirect_to root_path
    end
  end

end
