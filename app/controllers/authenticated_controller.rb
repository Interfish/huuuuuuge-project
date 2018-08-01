class AuthenticatedController < ApplicationController

before_action :authenticate

def authenticate
  unless cookies[:authentication] == Settings.authentication
    redirect_to root_path
  end
end

end
